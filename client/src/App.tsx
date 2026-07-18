import { UserProvider } from "./context/userProvider";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div>
      <UserProvider>
        <HomePage />
      </UserProvider>
    </div>
  );
};

export default App;
