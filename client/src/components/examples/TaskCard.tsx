import TaskCard, { type Task } from '../TaskCard';

export default function TaskCardExample() {
  // Mock task data for demonstration
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Complete quarterly presentation",
      description: "Prepare slides for Q4 review meeting with stakeholders",
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      priority: "High",
      status: "Incomplete",
      aiSuggestion: "Consider focusing on key metrics first, then add supporting data. Schedule 2 hours for this task tomorrow morning.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: "2", 
      title: "Review team feedback",
      description: "Go through all team member responses from last sprint",
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      priority: "Medium",
      status: "Incomplete",
      aiSuggestion: "This task pairs well with your 2pm meeting. Review feedback 30 minutes before the meeting.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: "3",
      title: "Buy groceries",
      priority: "Low",
      status: "Complete",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ];

  return (
    <div className="space-y-4 p-4 max-w-2xl">
      {mockTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
          onEdit={(id) => console.log(`Edit task ${id}`)}
          onDelete={(id) => console.log(`Delete task ${id}`)}
        />
      ))}
    </div>
  );
}