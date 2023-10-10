import HomeHeader from './HomeHeader';

function Offline() {

  return (
    <div>
      <HomeHeader />
      <div className="offline-message">
        <h1>You are currently offline</h1>
        <p>Please reconnect and try again.</p>
    </div>
    </div>
  );
}

export default Offline;