import Head from "next/head";
import { api } from "~/utils/api";

export default function Home() {
  const { data: tasks = [], isLoading: loadingTasks } = api.tasks.getAll.useQuery();

  if (loadingTasks) return <div>Loading tasks...</div>;
  return (
    <>
      <Head>
        <title>Ideal Memory</title>
        <meta name="description" content="A task keeping application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.body}</li>
          ))}
        </ul>
      </main>
    </>
  );
}
