import React, { useState, useEffect } from "react";
import "../pages/shift.css";
// sidebar is provided by Layout
import logo from '../assets/salespoint-logo.png';

export default function ShiftSchedule() {
const [searchTerm, setSearchTerm] = useState('');

// Week navigation
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

// Modals
const [showEmployeeModal, setShowEmployeeModal] = useState(false);
const [newEmployeeName, setNewEmployeeName] = useState("");
const [showShiftModal, setShowShiftModal] = useState(false);
const [selectedShift, setSelectedShift] = useState({ employee: null, date: null });
const [shiftType, setShiftType] = useState("morning");
const [shiftTime, setShiftTime] = useState({ start: "", end: "" });

const defaultShiftTimes = {
morning: { start: "06:00", end: "14:00" },
afternoon: { start: "14:00", end: "22:00" },
night: { start: "22:00", end: "06:00" }
};

// Week dates
const weekDates = Array.from({ length: 5 }, (_, i) => {
const d = new Date(currentWeekStart);
d.setDate(d.getDate() + i);
return d;
});

// Mock data
useEffect(() => {
setEmployees([
{ id: 1, name: "John Doe" },
{ id: 2, name: "Maria Santos" },
{ id: 3, name: "John Reyes" }
]);
setShifts({ 1: {}, 2: {}, 3: {} });
}, []);

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
const saveEmployee = () => {
if (!newEmployeeName.trim()) return;
const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
setEmployees([...employees, { id: newId, name: newEmployeeName }]);
setShowEmployeeModal(false);
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

  return (
    <div className="shift-page">
      {/* Sidebar is centralized in Layout */}
      {/* Main */}
      <main className="shift-page-wrapper" style={{ overflowX: 'hidden' }}>
    <header className="top-bar">
      <div className="logo-container"><img src={logo} alt="Logo" className="logo" /></div>
      <input type="text" placeholder="Search employees..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      <div className="top-icons"><span className="user">John Doe Owner</span></div>
    </header>

    <div className="shift-controls">
      <button className="add-employee-btn" onClick={openEmployeeModal}>+ Add Employee</button>
      <div className="week-nav">
        <button onClick={prevWeek}>{"<"}</button>
        <span>Week of {weekDates[0].toLocaleDateString()} - {weekDates[4].toLocaleDateString()}</span>
        <button onClick={nextWeek}>{">"}</button>
      </div>
    </div>

    {/* Schedule Table */}
    <div className="schedule-card">
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Name</th>
            {weekDates.map((d, idx) => (
              <th key={idx}>
                {d.toLocaleDateString('en-US', { weekday: 'short' })}<br />
                <span className="sub">{d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              {weekDates.map(date => {
                const dateStr = date.toISOString().split('T')[0];
                const dayShifts = shifts[emp.id]?.[dateStr] || [];
                return (
                  <td key={dateStr} onClick={() => openShiftModal(emp, date)}>
                    {dayShifts.length
                      ? dayShifts.map((s, i) => (
                          <div key={i} className={`shift ${shiftColorClass(s.type)}`}>
                            {s.type !== "flexible" ? `${s.time.start} - ${s.time.end}` : `${s.time.start || ""} - ${s.time.end || ""}`}
                          </div>
                        ))
                      : <div className="empty">+</div>
                    }
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>

  {/* Employee Modal */}
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

  {/* Shift Modal */}
  {showShiftModal && (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Shifts</h3>
        <div className="shift-list">
          {(shifts[selectedShift.employee.id]?.[selectedShift.date.toISOString().split('T')[0]] || []).map((s, i) => (
            <div key={i} className={`shift-list-item ${shiftColorClass(s.type)}`}>
              <span>{s.type !== "flexible" ? `${s.time.start} - ${s.time.end}` : `${s.time.start || ""} - ${s.time.end || ""}`} ({s.type})</span>
              <button className="remove-btn" onClick={() => {
                const dateStr = selectedShift.date.toISOString().split('T')[0];
                setShifts(prev => {
                  const employeeShifts = prev[selectedShift.employee.id] || {};
                  const dayShifts = employeeShifts[dateStr] || [];
                  const updatedDayShifts = dayShifts.filter((_, idx) => idx !== i);
                  return {
                    ...prev,
                    [selectedShift.employee.id]: { ...employeeShifts, [dateStr]: updatedDayShifts }
                  };
                });
              }}>✕</button>
            </div>
          ))}
        </div>

        <div className="modal-field">
          <label>Shift Type</label>
          <select value={shiftType} onChange={e => setShiftType(e.target.value)}>
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
          <button onClick={() => {
            const dateStr = selectedShift.date.toISOString().split('T')[0];
            setShifts(prev => {
              const employeeShifts = prev[selectedShift.employee.id] || {};
              const dayShifts = employeeShifts[dateStr] || [];
              return {
                ...prev,
                [selectedShift.employee.id]: { ...employeeShifts, [dateStr]: [...dayShifts, { type: shiftType, time: shiftTime }] }
              };
            });
          }}>+ Add Shift</button>
        </div>
      </div>
    </div>
  )}
</div>

);
}
