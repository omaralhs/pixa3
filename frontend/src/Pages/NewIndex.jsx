import '../App.css';
import Header  from "../components/Header"
import MainCard from '../components/MainCard';
import ThreeValues from '../components/ThreeValues';
import HowToPlay from '../components/HowToPlay';
import Phone from '../components/Phone';
import Advantages from '../components/Advantages';
import QuestionsGroup from '../components/QuestionsGroup';
import Video from '../components/Video';
import Footer from '../components/Footer';

function NewIndex(){
   return(
     <div className='index'>
      <Header></Header>
      <div className='TowGs'>
         <div className="group-A">
          <img className='backgroundimg' src='/images/backgroundimg.png' alt='backgroundimage'></img>
          <h1>המשחק שבו דמיון, יצירתיות ובינה מלאכותית נפגשים</h1>
          <MainCard></MainCard>
         </div>

         <div className="group-B">
          <ThreeValues></ThreeValues>
          <p className='bluetext'>PIXA נועד ללמד תלמידים כיצד לנסח הנחיות מדויקות וברורות לבינה מלאכותית, במטרה ליצור תוצרים איכותיים ומותאמים.</p>
          <HowToPlay></HowToPlay>
          <Phone></Phone>
          <Advantages></Advantages>
          <QuestionsGroup ></QuestionsGroup>
          <Video></Video>
          <Footer></Footer>
         </div>
       </div>
    </div>
    );
}
export default NewIndex;