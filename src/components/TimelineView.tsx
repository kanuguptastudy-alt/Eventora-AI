import React, { useState } from 'react';
import { EventProject, TimelineTask, RunOfShowItem, GuestItem } from '../types';
import { InvitationDrafterModal } from './InvitationDrafterModal';

interface TimelineViewProps {
  event: EventProject;
  onUpdateEvent: (updated: EventProject) => void;
  onShowToast: (message: string) => void;
  onNavigateToCopilot?: (prompt: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  event,
  onUpdateEvent,
  onShowToast,
  onNavigateToCopilot,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'runOfShow' | 'guests'>('tasks');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPhase, setNewPhase] = useState('Critical Deadlines');
  const [newDueInDays, setNewDueInDays] = useState('10');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Normal'>('Medium');
  const [newCategory, setNewCategory] = useState('General');
  const [newDescription, setNewDescription] = useState('');

  // New guest form state
  const [guestName, setGuestName] = useState('');
  const [guestPartySize, setGuestPartySize] = useState('2');
  const [guestDietary, setGuestDietary] = useState('Vegetarian');
  const [guestStatus, setGuestStatus] = useState<'confirmed' | 'pending' | 'declined'>('confirmed');

  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter((t) => t.completed).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Unique phases
  const phases = Array.from(new Set(event.tasks.map((t) => t.phase))).filter(Boolean);

  const toggleTaskComplete = (id: string) => {
    const updated = event.tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    onUpdateEvent({ ...event, tasks: updated });
    onShowToast('Task status updated.');
  };

  const handleDeleteTask = (id: string) => {
    const updated = event.tasks.filter((t) => t.id !== id);
    onUpdateEvent({ ...event, tasks: updated });
    onShowToast('Task removed from timeline.');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TimelineTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      phase: newPhase,
      dueInDays: Number(newDueInDays) || 7,
      dueDate: `Due in ${newDueInDays} days`,
      priority: newPriority,
      completed: false,
      category: newCategory,
      description: newDescription.trim() || 'No detailed specifications added.',
    };

    onUpdateEvent({
      ...event,
      tasks: [newTask, ...event.tasks],
    });

    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
    onShowToast(`Milestone "${newTask.title}" added to timeline.`);
  };

  const handleToggleRos = (id: string) => {
    const updatedRos = event.runOfShow.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    onUpdateEvent({ ...event, runOfShow: updatedRos });
    onShowToast('Run of show status synchronized.');
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newGuest: GuestItem = {
      id: `g-${Date.now()}`,
      name: guestName.trim(),
      partySize: Number(guestPartySize) || 1,
      dietary: guestDietary,
      status: guestStatus,
    };

    onUpdateEvent({
      ...event,
      guests: [newGuest, ...event.guests],
    });

    setGuestName('');
    setShowAddGuestModal(false);
    onShowToast(`Guest ${newGuest.name} added to register.`);
  };

  const handleDeleteGuest = (id: string) => {
    const updated = event.guests.filter((g) => g.id !== id);
    onUpdateEvent({ ...event, guests: updated });
    onShowToast('Guest record removed.');
  };

  // What should I do next? recommendation
  const nextRecommendedTask =
    event.tasks.find((t) => !t.completed && t.priority === 'High') ||
    event.tasks.find((t) => !t.completed) ||
    null;

  const handleExportGuestsCSV = () => {
    const headers = ['Name', 'Party Size', 'Dietary', 'Table', 'Status'];
    const rows = event.guests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      g.partySize,
      `"${g.dietary || 'Standard'}"`,
      `"${g.table || 'General'}"`,
      g.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Guest_List.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onShowToast('Guest directory exported as CSV.');
  };

  const filteredTasks = event.tasks.filter((t) => {
    if (selectedPhase !== 'all' && t.phase !== selectedPhase) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] uppercase tracking-wider">
              Autonomous Timeline Synthesis
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-primary">
              Run-of-Show Choreography
            </span>
          </div>
          <h1 className="font-display-hero text-headline-xl sm:text-headline-xl text-on-surface tracking-tight">
            Preparation Timeline &amp; Run-of-Show
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Target Event Date: <span className="text-primary font-bold">{event.date}</span> ({event.duration})
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`px-4 py-1.5 rounded-full font-body-sm text-body-sm transition-all cursor-pointer ${
              activeSubTab === 'tasks'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(183,109,255,0.4)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Preparation Milestones ({totalTasks})
          </button>
          <button
            onClick={() => setActiveSubTab('runOfShow')}
            className={`px-4 py-1.5 rounded-full font-body-sm text-body-sm transition-all cursor-pointer ${
              activeSubTab === 'runOfShow'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(183,109,255,0.4)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Day-of Run-of-Show ({event.runOfShow.length})
          </button>
          <button
            onClick={() => setActiveSubTab('guests')}
            className={`px-4 py-1.5 rounded-full font-body-sm text-body-sm transition-all cursor-pointer ${
              activeSubTab === 'guests'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(183,109,255,0.4)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Guest Register ({event.guests.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: PREPARATION TASKS */}
      {activeSubTab === 'tasks' && (
        <div className="flex flex-col gap-space-lg">
          {/* FEATURE C: "WHAT SHOULD I DO NEXT?" PROMINENT RECOMMENDATION CARD */}
          {nextRecommendedTask && (
            <div className="p-space-md rounded-2xl bg-gradient-to-r from-primary-container/20 via-surface-container to-surface-container-high border-2 border-primary/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[22px]">lightbulb</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-mono-sm text-[11px] text-primary uppercase font-bold tracking-wider">
                      What Should I Do Next? (AI Recommendation)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-[10px] font-bold uppercase">
                      Priority: {nextRecommendedTask.priority}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-[17px] font-bold text-on-surface mt-0.5">
                    {nextRecommendedTask.title}
                  </h3>
                  <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-1">
                    {nextRecommendedTask.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {onNavigateToCopilot && (
                  <button
                    onClick={() =>
                      onNavigateToCopilot(
                        `How do I best execute this upcoming milestone: "${nextRecommendedTask.title}"?`
                      )
                    }
                    className="px-3.5 py-2 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary text-[12px] font-label-mono-sm hover:bg-surface-container-highest cursor-pointer"
                  >
                    Ask Copilot
                  </button>
                )}
                <button
                  onClick={() => toggleTaskComplete(nextRecommendedTask.id)}
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ✓ Mark Complete
                </button>
              </div>
            </div>
          )}

          {/* Progress Telemetry Banner */}
          <div className="p-space-md rounded-xl bg-surface-container border border-outline-variant/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-highest"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary-container"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${progressPct}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-headline-sm text-[13px] font-bold text-on-surface">
                  {progressPct}%
                </div>
              </div>
              <div>
                <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                  {completedTasks} of {totalTasks} Preparation Milestones Cleared
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Predictive neural buffers automatically adjust dependent deadlines when milestones are marked.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[14px] font-semibold shadow-[0_0_20px_rgba(183,109,255,0.4)] hover:shadow-[0_0_30px_rgba(183,109,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>Add Milestone</span>
            </button>
          </div>

          {/* Phase Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-caption font-label-mono-sm text-on-surface-variant uppercase pr-1">
              Phases:
            </span>
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-3 py-1 rounded-full font-label-mono-sm text-[12px] transition-all cursor-pointer ${
                selectedPhase === 'all'
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_8px_rgba(183,109,255,0.4)]'
                  : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({event.tasks.length})
            </button>
            {phases.map((ph) => (
              <button
                key={ph}
                onClick={() => setSelectedPhase(ph)}
                className={`px-3 py-1 rounded-full font-label-mono-sm text-[12px] transition-all cursor-pointer ${
                  selectedPhase === ph
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_8px_rgba(183,109,255,0.4)]'
                    : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {ph} ({event.tasks.filter((t) => t.phase === ph).length})
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-caption font-label-mono-sm text-on-surface-variant">Priority:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface text-[12px] font-label-mono-sm focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Task Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {filteredTasks.length === 0 ? (
              <div className="col-span-2 p-10 rounded-xl bg-surface-container-low text-center text-on-surface-variant font-body-sm">
                No tasks match the active filters.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-space-md rounded-xl border transition-all flex flex-col justify-between gap-3 shadow-md ${
                    task.completed
                      ? 'bg-surface-container-low/50 border-outline-variant/15 opacity-75'
                      : 'bg-surface-container-low border-outline-variant/30 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`mt-1 w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-primary border-primary text-on-primary shadow-[0_0_8px_#ddb7ff]'
                          : 'border-outline hover:border-primary bg-surface-container'
                      }`}
                    >
                      {task.completed && (
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      )}
                    </button>

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span
                          className={`font-headline-sm text-[16px] font-semibold ${
                            task.completed
                              ? 'line-through text-on-surface-variant'
                              : 'text-on-surface'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-label-mono-sm text-[10px] uppercase font-bold ${
                            task.priority === 'High'
                              ? 'bg-error-container text-on-error-container'
                              : task.priority === 'Medium'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <p className="font-body-sm text-[13px] text-on-surface-variant">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-3 font-label-mono-sm text-[11px] text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/15 flex-wrap">
                        <span className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-[14px]">alarm</span>
                          Due in {task.dueInDays} days
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface">
                          {task.phase}
                        </span>
                        <span>•</span>
                        <span>{task.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: DAY-OF RUN-OF-SHOW CHOREOGRAPHY */}
      {activeSubTab === 'runOfShow' && (
        <div className="rounded-xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Minute-by-Minute Run-of-Show Schedule
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Orchestrated on-site sequence with lead coordinators and venue zones.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-label-mono-sm text-[11px] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Stage Ready
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 flex flex-col gap-4 mt-2">
            <div className="absolute left-3 sm:left-4 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary via-primary-container to-secondary" />

            {event.runOfShow.map((ros) => (
              <div
                key={ros.id}
                className={`relative p-space-md rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  ros.completed
                    ? 'bg-surface-container-low/40 border-outline-variant/15 opacity-70'
                    : 'bg-surface-container-low border-outline-variant/25 hover:border-primary/40'
                }`}
              >
                <div
                  className={`absolute -left-6 sm:-left-7 top-5 w-3 h-3 rounded-full ring-4 ring-surface-container transition-colors ${
                    ros.completed ? 'bg-emerald-400' : 'bg-primary'
                  }`}
                />

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[12px] font-bold">
                      {ros.time}
                    </span>
                    <span className="text-caption font-label-mono-sm text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {ros.location}
                    </span>
                  </div>
                  <h3
                    className={`font-headline-sm text-[15px] font-semibold ${
                      ros.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'
                    }`}
                  >
                    {ros.activity}
                  </h3>
                  <span className="text-caption font-body-sm text-on-surface-variant">
                    Lead: <span className="text-on-surface font-medium">{ros.lead}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleRos(ros.id)}
                    className={`px-3 py-1.5 rounded-full font-label-mono-sm text-[11px] font-semibold transition-all cursor-pointer ${
                      ros.completed
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface'
                    }`}
                  >
                    {ros.completed ? '✓ Executed' : 'Mark In Progress'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: GUEST REGISTER & RSVP */}
      {activeSubTab === 'guests' && (
        <div className="rounded-xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Guest Register &amp; RSVP Directory
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Total Attendance Target: {event.guestCount} guests • Private &amp; secure registry.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowInvitationModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container text-[12px] font-headline-sm font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
                <span>Draft Invites with AI</span>
              </button>

              <button
                onClick={handleExportGuestsCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface text-[12px] font-label-mono-sm hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowAddGuestModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary text-[12px] font-label-mono-sm hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>Add Guest</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 font-label-mono-sm text-[11px] text-on-surface-variant uppercase">
                  <th className="py-3 px-3">Name / Group</th>
                  <th className="py-3 px-3">Party Size</th>
                  <th className="py-3 px-3">Dietary Preference</th>
                  <th className="py-3 px-3">Seating / Table</th>
                  <th className="py-3 px-3">RSVP Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 font-body-sm text-[13px]">
                {event.guests.map((g) => (
                  <tr key={g.id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-on-surface">{g.name}</td>
                    <td className="py-3.5 px-3 font-label-mono-sm text-[13px]">
                      {g.partySize} {g.partySize > 1 ? 'patrons' : 'guest'}
                    </td>
                    <td className="py-3.5 px-3 text-on-surface-variant">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-[11px]">
                        {g.dietary || 'Standard'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-label-mono-sm text-[12px] text-secondary">
                      {g.table || 'General'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-label-mono-sm text-[10px] uppercase font-bold ${
                          g.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-300'
                            : g.status === 'declined'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleDeleteGuest(g.id)}
                        className="p-1 rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">
                Add Timeline Milestone
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddTask} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Milestone Title
                </label>
                <input
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Confirm acoustic live band sound specs"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Planning Phase
                  </label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Critical Deadlines">Critical Deadlines</option>
                    <option value="Early Stage (3-6 Months Out)">Early Stage</option>
                    <option value="Mid Planning (1-2 Months Out)">Mid Planning</option>
                    <option value="Final Stretch (1-2 Weeks Out)">Final Stretch</option>
                    <option value="Event Week">Event Week</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Due in (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newDueInDays}
                    onChange={(e) => setNewDueInDays(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  >
                    <option value="High">High (Blocking)</option>
                    <option value="Medium">Medium</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>

                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Category Tag
                  </label>
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Sound, Decor, Venue"
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Details / Action Required
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Specific requirements or vendor coordination points..."
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-surface-container text-on-surface text-body-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Guest Modal */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">
                Add Guest to Directory
              </h3>
              <button
                onClick={() => setShowAddGuestModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Guest or Family Name
                </label>
                <input
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Vikramaditya Rathore & Family"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Party Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guestPartySize}
                    onChange={(e) => setGuestPartySize(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                    Dietary
                  </label>
                  <select
                    value={guestDietary}
                    onChange={(e) => setGuestDietary(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Jain">Jain Pure Veg</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Halal">Halal Non-Veg</option>
                    <option value="Standard">Standard Gourmet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  RSVP Status
                </label>
                <select
                  value={guestStatus}
                  onChange={(e) => setGuestStatus(e.target.value as any)}
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Awaiting Response</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 rounded-full bg-surface-container text-on-surface text-body-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Invitation Drafter Modal */}
      <InvitationDrafterModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
        event={event}
        onShowToast={onShowToast}
      />
    </div>
  );
};
