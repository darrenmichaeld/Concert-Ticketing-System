import { Router } from './routes';
import useFetch from './hooks/useFetch';

interface Data{
  name: string;
  date: string;
  venue: string;
  description: string;
  max_capacity: number;
  start_time: string;
  end_time: string;
}

function App() {
  const { data, error } = useFetch<any>('http://localhost:3000/events');
  console.log("THIS IS THE DATA", data, error);

  return (
    <>
        <Router/>
    </>
  );
}

export default App;


