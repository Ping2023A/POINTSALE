import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../pages-css/shift.css";
import logo from '../assets/salespoint-logo.png';

export default function ShiftSchedule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday;
  });

  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState({});
  const [employeeAvailability, setEmployeeAvailability] = useState({}); // { empId: [YYYY-MM-DD] }
  const [serverSnapshot, setServerSnapshot] = useState({}); // snapshot of server shifts to detect deletions

  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState({ employee: null, date: null });
  const [shiftType, setShiftType] = useState("morning");
  const [shiftTime, setShiftTime] = useState({ start: "", end: "" });
  // Move shifts modal when employee is on leave
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveInfo, setMoveInfo] = useState({ empId: null, fromDate: null });
  const [selectedMoveDate, setSelectedMoveDate] = useState(null);
  // Undo state for move action
  const [undoInfo, setUndoInfo] = useState(null); // { empId, fromDate, toDate, prevSnapshot, moved }
  const undoTimerRef = useRef(null);

  const defaultShiftTimes = {
    morning: { start: "06:00", end: "14:00" },
    afternoon: { start: "14:00", end: "22:00" },
    night: { start: "22:00", end: "06:00" },
    flexible: { start: "", end: "" }
  };

  const weekDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    // Fetch employees from backend roles endpoint
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/roles");
        const roles = res.data || [];
        const emps = roles.map(r => ({ id: r._id, name: r.name }));
        setEmployees(emps);

        const initShifts = {};
        const availability = {};
        emps.forEach(emp => { initShifts[emp.id] = {}; availability[emp.id] = []; });
        setShifts(initShifts);
        setEmployeeAvailability(availability);
      } catch (err) {
        console.error("Failed to load roles for shifts:", err);
        // fallback to a small default so UI remains usable
        const mockEmployees = [ { id: 1, name: "John Doe" } ];
        setEmployees(mockEmployees);
      }
    };
    fetchEmployees();
  }, []);

  // Load shifts for the current week whenever week changes
  useEffect(() => {
    const loadWeekShifts = async () => {
      try {
        const weekStartStr = weekDates[0].toISOString().split('T')[0];
        const res = await axios.get(`http://localhost:5000/api/shifts?weekStart=${weekStartStr}`);
        const serverShifts = res.data || [];

        // Build shifts map { empId: { date: [shift,...] } }
        const map = {};
        serverShifts.forEach(s => {
          const emp = s.employeeId?.toString() || s.employeeId;
          map[emp] = map[emp] || {};
          map[emp][s.date] = map[emp][s.date] || [];
          map[emp][s.date].push({ type: s.type, time: { start: s.start || defaultShiftTimes[s.type]?.start || '', end: s.end || defaultShiftTimes[s.type]?.end || '' }, status: s.status });
        });

        // Merge into existing shifts state (preserve local-only entries)
        setShifts(prev => ({ ...prev, ...map }));

        // Save server snapshot for deletion detection
        setServerSnapshot(JSON.parse(JSON.stringify(map)));

        // Build availability: employees with shifts should be available on those dates;
        // employees without shifts for a date remain OFF.
        const availability = {};
        const allEmpIds = Array.from(new Set([...Object.keys(map), ...employees.map(e => e.id?.toString ? e.id.toString() : e.id)]));
        allEmpIds.forEach(empId => {
          availability[empId] = Object.keys(map[empId] || {});
        });
        setEmployeeAvailability(availability);
      } catch (err) {
        console.error('Failed to load week shifts:', err);
      }
    };
    loadWeekShifts();
  }, [currentWeekStart]);

  // Save current shifts to backend (bulk)
  // opts: { silent } - do not show alerts
  // shiftsArg: optional snapshot to save instead of current state
  const saveShiftsToServer = async (opts = { silent: false }, shiftsArg = null) => {
    try {
      const source = shiftsArg || shifts;
      // Flatten shifts state into array of shift objects
      const payload = [];
      Object.entries(source).forEach(([empId, days]) => {
        if (String(empId).startsWith('temp-')) return;
        Object.entries(days).forEach(([date, dayShifts]) => {
          dayShifts.forEach(s => {
            payload.push({ employeeId: empId, date, type: s.type, start: s.time?.start || '', end: s.time?.end || '', status: s.status || 'assigned' });
          });
        });
      });

      // Add deletion markers for any server-side shift that no longer exists in source
      const deletionMarkers = [];
      Object.entries(serverSnapshot || {}).forEach(([empId, days]) => {
        Object.keys(days || {}).forEach(date => {
          const present = source[empId] && Array.isArray(source[empId][date]) && source[empId][date].length > 0;
          if (!present) deletionMarkers.push({ employeeId: empId, date, _delete: true });
        });
      });

      const finalPayload = [...payload, ...deletionMarkers];
      if (finalPayload.length === 0) {
        if (!opts.silent) alert('No shifts to save or only temporary employees present');
        return null;
      }

      const res = await axios.post('http://localhost:5000/api/shifts/bulk', finalPayload);
      if (!opts.silent) alert(`Saved shifts`);

      // update server snapshot to reflect the saved state
      setServerSnapshot(JSON.parse(JSON.stringify(source)));
      return res;
    } catch (err) {
      console.error('Failed to save shifts:', err);
      if (!opts.silent) alert('Failed to save shifts to server');
      throw err;
    }
  };

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };
  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEmployeeModal = () => {
    setNewEmployeeName("");
    setShowEmployeeModal(true);
  };
  const saveEmployee = async () => {
    if (!newEmployeeName.trim()) return alert("Please enter a name");
    try {
      const payload = { name: newEmployeeName, email: `${Date.now()}@local`, role: 'Employee', date: new Date().toISOString().split('T')[0], phone: '' };
      const res = await axios.post('http://localhost:5000/api/roles', payload);
      const created = res.data;
      const newEmp = { id: created._id, name: created.name };
      setEmployees(prev => [...prev, newEmp]);
      setShifts(prev => ({ ...prev, [newEmp.id]: {} }));
      setEmployeeAvailability(prev => ({ ...prev, [newEmp.id]: [] }));
      setShowEmployeeModal(false);//here
      // Fetch the shifts for the current week (backend creates default morning shifts)
      try {
        const weekStartStr = weekDates[0].toISOString().split('T')[0];
        const res2 = await axios.get(`http://localhost:5000/api/shifts?weekStart=${weekStartStr}`);
        const serverShifts = res2.data || [];
        const map = {};
        serverShifts.forEach(s => {
          const emp = s.employeeId?.toString() || s.employeeId;
          map[emp] = map[emp] || {};
          map[emp][s.date] = map[emp][s.date] || [];
          map[emp][s.date].push({ type: s.type, time: { start: s.start || defaultShiftTimes[s.type]?.start || '', end: s.end || defaultShiftTimes[s.type]?.end || '' }, status: s.status });
        });
        setShifts(prev => ({ ...prev, ...map }));
      } catch (e) {
        console.error('Failed to load shifts after creating employee:', e);
      }
    } catch (err) {//stop
      console.error('Failed to create employee role:', err?.response || err);
      alert(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const refreshEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/roles");
      const roles = res.data || [];
      setEmployees(roles.map(r => ({ id: r._id, name: r.name })));
    } catch (err) {
      console.error('Failed to refresh employees:', err);
    }
  };

  const openShiftModal = (employee, date) => {
    setSelectedShift({ employee, date });
    setShiftType("morning");
    setShiftTime(defaultShiftTimes["morning"]);
    setShowShiftModal(true);
  };

  const shiftColorClass = type => {
    switch (type) {
      case "morning": return "red";
      case "afternoon": return "blue";
      case "night": return "green";
      case "flexible": return "yellow";
      default: return "red";
    }
  };

  const calculateShiftHours = (time) => {
    if (!time.start || !time.end) return 0;
    const [startH, startM] = time.start.split(":").map(Number);
    const [endH, endM] = time.end.split(":").map(Number);

    let start = startH + startM / 60;
    let end = endH + endM / 60;
    if (end <= start) end += 24;
    return ((end - start) || 0).toFixed(1);
  };

  const parseTimeToDecimal = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h + m / 60;
  };

  const addShift = async () => {
    const dateStr = selectedShift.date.toISOString().split('T')[0];
    const empId = selectedShift.employee.id;
    const employeeShifts = { ...(shifts[empId] || {}) };
    const dayShifts = employeeShifts[dateStr] || [];

    const newStart = parseTimeToDecimal(shiftTime.start);
    const newEnd = parseTimeToDecimal(shiftTime.end);
    const overlap = dayShifts.some(s => {
      const sStart = parseTimeToDecimal(s.time.start);
      const sEnd = parseTimeToDecimal(s.time.end);
      return (newStart < sEnd && newEnd > sStart);
    });
    if (overlap) { alert("Shift overlaps with existing shift!"); return; }

    const newDay = [...dayShifts, { type: shiftType, time: shiftTime }];
    employeeShifts[dateStr] = newDay;
    const newShifts = { ...shifts, [empId]: employeeShifts };
    setShifts(newShifts);
    // mark availability for this date
    setEmployeeAvailability(prev => ({ ...prev, [empId]: Array.from(new Set([...(prev[empId]||[]), dateStr])) }));
    // auto-save the change
    try {
      await saveShiftsToServer({ silent: true }, newShifts);
    } catch (e) { console.error('Auto-save failed after addShift', e); }
  };

  const getTotalHours = (empId) => {
    const empShifts = shifts[empId] || {};
    let total = 0;
    Object.values(empShifts).forEach(dayShifts => {
      dayShifts.forEach(s => total += Number(calculateShiftHours(s.time)));
    });
    return total.toFixed(1);
  };

  // --- Auto Assignment ---
  const autoAssignShifts = () => {
    const newShifts = { ...shifts };
    const allShiftTypes = ["morning", "afternoon", "night"];
    weekDates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      allShiftTypes.forEach(type => {
        // Find available employee with least hours
        const candidates = employees.filter(emp =>
          employeeAvailability[emp.id]?.includes(dateStr) &&
          !(newShifts[emp.id]?.[dateStr]?.some(s => s.type === type))
        );
        if (candidates.length === 0) return;
        candidates.sort((a, b) => parseFloat(getTotalHours(a.id)) - parseFloat(getTotalHours(b.id)));
        const selectedEmp = candidates[0];
        const empShifts = newShifts[selectedEmp.id] || {};
        const dayShifts = empShifts[dateStr] || [];
        empShifts[dateStr] = [...dayShifts, { type, time: defaultShiftTimes[type] }];
        newShifts[selectedEmp.id] = empShifts;
      });
    });
    setShifts(newShifts);
  };

  // Toggle availability
  const toggleAvailability = (empId, dateStr) => {
    setEmployeeAvailability(prev => {
      const avail = prev[empId] || [];
      const isAvail = avail.includes(dateStr);
      // If currently available and user is turning them off
      if (isAvail) {
        const dayShifts = (shifts[empId] || {})[dateStr] || [];
        if (dayShifts.length > 0) {
          // Open move modal to choose another day
          setMoveInfo({ empId, fromDate: dateStr });
          // default selectedMoveDate -> next available day in week (or first different day)
          const otherDates = weekDates.map(d => d.toISOString().split('T')[0]).filter(d => d !== dateStr);
          setSelectedMoveDate(otherDates.length ? otherDates[0] : null);
          setShowMoveModal(true);
          return prev; // do not change availability yet
        }
        return { ...prev, [empId]: avail.filter(d => d !== dateStr) };
      }
      // turning on
      return { ...prev, [empId]: [...avail, dateStr] };
    });
  };

  const moveShiftsToDate = (empId, fromDate, toDate) => {
    let prevSnapshot = null;
    setShifts(prev => {
      const empShifts = prev[empId] || {};
      prevSnapshot = JSON.parse(JSON.stringify(empShifts));
      const from = empShifts[fromDate] || [];
      if (!from.length) return prev;
      const to = empShifts[toDate] || [];
      const updatedEmpShifts = { ...empShifts, [toDate]: [...to, ...from] };
      delete updatedEmpShifts[fromDate];
      return { ...prev, [empId]: updatedEmpShifts };
    });

    // update availability: remove fromDate, ensure toDate is available
    setEmployeeAvailability(prev => {
      const avail = new Set(prev[empId] || []);
      avail.delete(fromDate);
      avail.add(toDate);
      return { ...prev, [empId]: Array.from(avail) };
    });

    setShowMoveModal(false);
    setMoveInfo({ empId: null, fromDate: null });
    setSelectedMoveDate(null);

    // auto-save and setup undo
    (async () => {
      try {
        await saveShiftsToServer({ silent: true });
        // show undo snackbar
        const moved = (prevSnapshot && prevSnapshot[fromDate]) ? prevSnapshot[fromDate].length : 0;
        setUndoInfo({ empId, fromDate, toDate, prevSnapshot, moved });
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = setTimeout(() => {
          setUndoInfo(null);
          undoTimerRef.current = null;
        }, 8000);
      } catch (err) {
        console.error('Auto-save failed after moving shifts:', err);
        alert('Failed to save shifts after moving. Your changes are still local.');
      }
    })();
  };

  return (
    <div className="shift-page">
      <main className="shift-page-wrapper">
        <header className="top-bar">
          <div className="logo-container"><img src={logo} alt="Logo" className="logo" /></div>
          <input type="text" placeholder="Search employees..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div className="top-icons"><span className="user">John Doe Owner</span></div>
        </header>

        <div className="shift-controls">
          <div className="week-nav">
            <button onClick={prevWeek}>{"<"}</button>
            <span>Week of {weekDates[0].toLocaleDateString()} - {weekDates[4].toLocaleDateString()}</span>
            <button onClick={nextWeek}>{">"}</button>
          </div>
          <div className="shift-actions">
            <button className="save-shifts-btn" onClick={() => saveShiftsToServer()} title="Save all shifts to server">Save Shifts</button>
          </div>
        </div>

        <div className="schedule-card">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Name</th>
                {weekDates.map(d => (
                  <th key={d.toISOString()}>
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}<br/>
                    <span className="sub">{d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                  </th>
                ))}
                <th>Total Hrs</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  {weekDates.map(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    const dayShifts = shifts[emp.id]?.[dateStr] || [];
                    const totalDayHours = dayShifts.reduce((sum, s) => sum + Number(calculateShiftHours(s.time)), 0).toFixed(1);
                    const available = employeeAvailability[emp.id]?.includes(dateStr);

                    return (
                      <td key={dateStr} onClick={() => openShiftModal(emp, date)} title={`Total: ${totalDayHours} hrs`}>
                        <div style={{ fontSize: '10px', color: available ? 'green' : 'gray' }} onClick={e => { e.stopPropagation(); toggleAvailability(emp.id, dateStr); }}>
                          {available ? 'Available' : 'Off'}
                        </div>
                        {dayShifts.length
                          ? dayShifts.map((s, i) => (
                              <div key={i} className={`shift ${shiftColorClass(s.type)}`} title={`${s.type.toUpperCase()} Shift\n${s.time.start} - ${s.time.end}\n${calculateShiftHours(s.time)} hrs`}>
                                {s.type !== "flexible" ? `${s.time.start} - ${s.time.end}` : `${s.time.start || ""} - ${s.time.end || ""}`}
                              </div>
                            ))
                          : <div className="empty">+</div>
                        }
                      </td>
                    );
                  })}
                  <td>{getTotalHours(emp.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Employee Modal & Shift Modal (same as previous) */}
      {showEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Employee</h3>
            <input type="text" placeholder="Employee Name" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={() => setShowEmployeeModal(false)}>Cancel</button>
              <button onClick={saveEmployee}>Save</button>
            </div>
          </div>
        </div>
      )}

        {/* Undo snackbar */}
        {undoInfo && (
          <div className="undo-snackbar">
            <div className="undo-message">Moved {undoInfo.moved} shift{undoInfo.moved !== 1 ? 's' : ''} from {undoInfo.fromDate} to {undoInfo.toDate}</div>
            <div className="undo-actions">
              <button className="undo-btn" onClick={async () => {
                // restore snapshot
                setShifts(prev => ({ ...prev, [undoInfo.empId]: undoInfo.prevSnapshot }));
                // restore availability
                setEmployeeAvailability(prev => ({ ...prev, [undoInfo.empId]: Object.keys(undoInfo.prevSnapshot || {}) }));
                if (undoTimerRef.current) { clearTimeout(undoTimerRef.current); undoTimerRef.current = null; }
                setUndoInfo(null);
                try { await saveShiftsToServer({ silent: true }); } catch (e) { console.error('Failed saving after undo', e); }
              }}>Undo</button>
            </div>
          </div>
        )}

      {showMoveModal && (
        <div className="modal-overlay">
          <div className="modal move-modal">
            <div className="move-header">
              <div>
                <h3 style={{ margin: 0 }}>Employee On Leave</h3>
                <p className="muted">This employee has shifts on <strong>{moveInfo.fromDate}</strong>. Select a day to move those shifts to.</p>
              </div>
              <div className="move-preview">
                <small className="muted">Shifts to move:</small>
                <div style={{ marginTop: 6 }}>
                  {((shifts[moveInfo.empId] || {})[moveInfo.fromDate] || []).map((s, i) => (
                    <div key={i} className={`shift ${shiftColorClass(s.type)}`} style={{ height: 28, padding: '4px 8px', marginBottom: 6, fontSize: 12 }}>
                      {s.type} {s.time?.start ? ` • ${s.time.start}-${s.time.end}` : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="move-grid">
              {weekDates.map(d => {
                const dStr = d.toISOString().split('T')[0];
                if (dStr === moveInfo.fromDate) return null;
                const existing = (shifts[moveInfo.empId] || {})[dStr] || [];
                return (
                  <div key={dStr} className={`move-card ${selectedMoveDate === dStr ? 'selected' : ''}`} onClick={() => setSelectedMoveDate(dStr)}>
                    <div className="day">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="date">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="count">{existing.length} shifts</div>
                  </div>
                );
              })}
            </div>

            <div className="modal-buttons" style={{ marginTop: 18 }}>
              <button className="btn-secondary" onClick={() => { setShowMoveModal(false); setMoveInfo({ empId: null, fromDate: null }); setSelectedMoveDate(null); }}>Cancel</button>
              <button className="btn-primary" onClick={() => moveShiftsToDate(moveInfo.empId, moveInfo.fromDate, selectedMoveDate)} disabled={!selectedMoveDate}>Move Shifts</button>
            </div>
          </div>
        </div>
      )}

      {showShiftModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Shifts</h3>
            <div className="shift-list">
              {(shifts[selectedShift.employee.id]?.[selectedShift.date.toISOString().split('T')[0]] || []).map((s, i) => (
                <div key={i} className={`shift-list-item ${shiftColorClass(s.type)}`}>
                  <span>{s.type !== "flexible" ? `${s.time.start} - ${s.time.end}` : `${s.time.start || ""} - ${s.time.end || ""}`} ({s.type})</span>
                  <button className="remove-btn" onClick={async () => {
                    const dateStr = selectedShift.date.toISOString().split('T')[0];
                    const empId = selectedShift.employee.id;
                    const employeeShifts = { ...(shifts[empId] || {}) };
                    const dayShifts = employeeShifts[dateStr] || [];
                    const updatedDayShifts = dayShifts.filter((_, idx) => idx !== i);
                    if (updatedDayShifts.length) {
                      employeeShifts[dateStr] = updatedDayShifts;
                    } else {
                      delete employeeShifts[dateStr];
                    }
                    const newShifts = { ...shifts, [empId]: employeeShifts };
                    setShifts(newShifts);
                    // update availability: if no shifts left on that date, remove availability
                    setEmployeeAvailability(prev => {
                      const avail = new Set(prev[empId] || []);
                      if (!employeeShifts[dateStr]) avail.delete(dateStr);
                      return { ...prev, [empId]: Array.from(avail) };
                    });
                    try { await saveShiftsToServer({ silent: true }, newShifts); } catch (e) { console.error('Auto-save failed after remove', e); }
                  }}>✕</button>
                </div>
              ))}
            </div>

            <div className="modal-field">
              <label>Shift Type</label>
              <select value={shiftType} onChange={e => { setShiftType(e.target.value); setShiftTime(defaultShiftTimes[e.target.value]); }}>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="night">Night</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            {(shiftType === "flexible" || shiftType === "custom") && (
              <>
                <div className="modal-field">
                  <label>Start Time</label>
                  <input type="time" value={shiftTime.start || ""} onChange={e => setShiftTime(prev => ({ ...prev, start: e.target.value }))} />
                </div>
                <div className="modal-field">
                  <label>End Time</label>
                  <input type="time" value={shiftTime.end || ""} onChange={e => setShiftTime(prev => ({ ...prev, end: e.target.value }))} />
                </div>
              </>
            )}
            <div className="modal-buttons">
              <button onClick={() => setShowShiftModal(false)}>Cancel</button>
              <button onClick={() => { addShift(); setShowShiftModal(false); }}>+ Add Shift</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
