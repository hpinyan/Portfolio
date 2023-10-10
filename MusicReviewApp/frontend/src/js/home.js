import '../css/home.css';
import HomeHeader from './HomeHeader';
import HomeContents from './HomeContents';

function Home() {
  return (
    <div className="App">
      <HomeHeader/>
      <HomeContents/>
    </div>
  );
}

export default Home;
