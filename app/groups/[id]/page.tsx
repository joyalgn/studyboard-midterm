import { notFound } from "next/navigation";
import { getGroupById } from "@/lib/data";
import TaskItem from "@/components/TaskItem";
import NewTaskForm from "@/components/NewTaskForm";
import DeleteGroupButton from "@/components/DeleteGroupButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [group, session] = await Promise.all([
    getGroupById(params.id),
    getServerSession(authOptions),
  ]);

  if (!group) {
    notFound();
  }

  const isOwner = session?.user.id === group.ownerId;

  return (
    <div>
      <h1 className="text-3xl font-bold text-pink-950">{group.name}</h1>
      <p className="text-pink-800">
        {group.subject} · {group.memberCount} members · Created by{" "}
        {group.owner.name}
      </p>

      {isOwner && <DeleteGroupButton groupId={group.id} />}

      <h2 className="mt-8 text-lg font-semibold text-pink-950">Tasks</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {group.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isOwner={isOwner}
            groupId={group.id}
          />
        ))}
      </ul>

      {isOwner && <NewTaskForm groupId={group.id} />}
    </div>
  );
}