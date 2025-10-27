import React, { useState, useEffect } from 'react';
import { Task, Column, User, BoardData, Subtask } from '../types';
import { CloseIcon, SparklesIcon, PlusIcon, TrashIcon } from './icons';
import { generateSubtasks } from '../services/geminiService';
import StatusCell from './StatusCell';
import PriorityCell from './PriorityCell';
import AssigneeCell from './AssigneeCell';
import DueDateCell from './DueDateCell';
import TextCell from './TextCell';
import CheckboxCell from './CheckboxCell';
import ProgressCell from './ProgressCell';
import DropdownCell from './DropdownCell';

interface TaskDetailsModalProps {
    task: Task;
    columns: Column[];
    allUsers: User[];
    onClose: () => void;
    onUpdateTask: (updatedTask: Task) => void;
    onColumnUpdate: (updatedColumn: Column) => void;
    boardData: BoardData;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, columns, allUsers, onClose, onUpdateTask, onColumnUpdate, boardData }) => {
    const [editableTask, setEditableTask] = useState<Task>(task);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);

    useEffect(() => {
        setEditableTask(task);
    }, [task]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableTask(prev => ({ ...prev, title: e.target.value }));
    };

    const handleTitleBlur = () => {
        if(task.title !== editableTask.title) {
            onUpdateTask(editableTask);
        }
    }

    const handlePropertyChange = (columnId: string, value: any) => {
        const updatedTask = {
            ...editableTask,
            properties: {
                ...editableTask.properties,
                [columnId]: value,
            },
        };
        setEditableTask(updatedTask);
        onUpdateTask(updatedTask);
    };

    const handleGenerateSubtasks = async () => {
        setIsGeneratingSubtasks(true);
        try {
            const subtasks = await generateSubtasks(editableTask.title);
            const newSubtasks = subtasks.map(st => ({
                id: `subtask-${Date.now()}-${Math.random()}`,
                title: st.title,
                completed: false,
            }));
            const updatedTask = {
                ...editableTask,
                subtasks: [...(editableTask.subtasks || []), ...newSubtasks],
            };
            setEditableTask(updatedTask);
            onUpdateTask(updatedTask);
        } catch (error) {
            console.error("Failed to generate subtasks", error);
        } finally {
            setIsGeneratingSubtasks(false);
        }
    };
    
    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubtaskTitle.trim() === '') return;
        const newSubtask: Subtask = {
            id: `subtask-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            completed: false,
        };
        const updatedTask = { ...editableTask, subtasks: [...(editableTask.subtasks || []), newSubtask] };
        setEditableTask(updatedTask);
        onUpdateTask(updatedTask);
        setNewSubtaskTitle('');
    };

    const handleToggleSubtask = (subtaskId: string) => {
        const updatedSubtasks = editableTask.subtasks?.map(sub => 
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        if (updatedSubtasks) {
            const updatedTask = { ...editableTask, subtasks: updatedSubtasks };
            setEditableTask(updatedTask);
            onUpdateTask(updatedTask);
        }
    };

    const handleDeleteSubtask = (subtaskId: string) => {
        const updatedSubtasks = editableTask.subtasks?.filter(sub => sub.id !== subtaskId);
        if (updatedSubtasks) {
            const updatedTask = { ...editableTask, subtasks: updatedSubtasks };
            setEditableTask(updatedTask);
            onUpdateTask(updatedTask);
        }
    };

    const renderPropertyInput = (column: Column) => {
        const value = editableTask.properties[column.id];
        switch(column.type) {
            case 'status': return <StatusCell value={value} onChange={(v) => handlePropertyChange(column.id, v)} />;
            case 'priority': return <PriorityCell value={value} onChange={(v) => handlePropertyChange(column.id, v)} />;
            case 'assignee': return <AssigneeCell value={value} allUsers={allUsers} onChange={(v) => handlePropertyChange(column.id, v)} />;
            case 'date': return <DueDateCell value={value} onChange={(v) => handlePropertyChange(column.id, v)} />;
            case 'checkbox': return <CheckboxCell value={value} onChange={(v) => handlePropertyChange(column.id, v)} />;
            case 'progress': return <ProgressCell value={value} onChange={(v) => handlePropertyChange(column.id, v)} />;
            case 'dropdown': return <DropdownCell value={value} column={column} onValueChange={(v) => handlePropertyChange(column.id, v)} onColumnUpdate={onColumnUpdate} />;
            default: return <TextCell value={value} onChange={(v) => handlePropertyChange(column.id, v)} />;
        }
    }
    
    const parentGroup = boardData.groups.find(g => g.tasks.some(t => t.id === task.id));

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-2xl bg-[--card-bg] h-full shadow-2xl p-8 overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        {parentGroup && <p className="text-sm text-[--secondary-text] mb-1">{parentGroup.title}</p>}
                        <input
                            type="text"
                            value={editableTask.title}
                            onChange={handleTitleChange}
                            onBlur={handleTitleBlur}
                            className="text-3xl font-bold bg-transparent focus:outline-none w-full border-b-2 border-transparent focus:border-[--accent-color] transition-colors"
                        />
                    </div>
                    <button onClick={onClose} className="p-2 text-[--secondary-text] hover:bg-[--hover-bg] rounded-full">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                    {columns.map(col => (
                        <div key={col.id} className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-[--secondary-text] uppercase">{col.title}</label>
                            <div className="w-full">{renderPropertyInput(col)}</div>
                        </div>
                    ))}
                </div>

                <div className="mb-8">
                    <h4 className="text-sm font-semibold text-[--secondary-text] mb-2">DESCRIPTION</h4>
                    <textarea 
                        placeholder="Add a more detailed description..."
                        className="w-full bg-[--input-bg] text-[--primary-text] p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[--accent-color] min-h-[100px]"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-[--secondary-text]">SUBTASKS</h4>
                        <button onClick={handleGenerateSubtasks} disabled={isGeneratingSubtasks} className="flex items-center gap-1 text-sm font-medium text-[--accent-color] hover:text-[--accent-color-hover] disabled:opacity-50">
                            <SparklesIcon className="w-4 h-4" />
                            {isGeneratingSubtasks ? 'Generating...' : 'AI Generate'}
                        </button>
                    </div>
                    <div className="space-y-2">
                        {editableTask.subtasks?.map(sub => (
                            <div key={sub.id} className="flex items-center gap-2 group bg-[--hover-bg] p-2 rounded-md">
                                <input type="checkbox" checked={sub.completed} onChange={() => handleToggleSubtask(sub.id)} className="w-4 h-4 rounded text-[--accent-color] bg-[--input-bg] border-[--border-color] focus:ring-[--accent-color]" />
                                <span className={`flex-1 text-sm ${sub.completed ? 'line-through text-[--secondary-text]' : ''}`}>{sub.title}</span>
                                <button onClick={() => handleDeleteSubtask(sub.id)} className="text-[--secondary-text] hover:text-red-500 opacity-0 group-hover:opacity-100">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-3">
                         <PlusIcon className="w-4 h-4 text-[--secondary-text]" />
                         <input
                            type="text"
                            value={newSubtaskTitle}
                            onChange={e => setNewSubtaskTitle(e.target.value)}
                            placeholder="Add a new subtask"
                            className="bg-transparent w-full text-sm focus:outline-none placeholder:text-[--secondary-text]/60 py-1"
                         />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;