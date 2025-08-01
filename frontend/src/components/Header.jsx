import '../App.css';


function scroll(elemnt){
   window.scrollTo({
    top: elemnt.getBoundingClientRect().top + window.pageYOffset -350,
    behavior:'smooth',
    
   })
}

function Header(){
    return (
        <div className="header-container">
            <img src='/images/pixalogo.svg' alt='logo'></img>
            <div className='container'>
            <p onClick={() => scroll(document.getElementById("questions"))}>שאלות ותשובות</p>
            <p onClick={() => scroll(document.getElementsByClassName("group-Advantages")[0])}>יתרונות המשחק</p>
            <p onClick={() => scroll(document.getElementsByClassName("Group-c")[0])}>איך המשחק עובד?</p>
            </div>
            
            <img src="/images/manicon.svg" alt='icon'></img>

        </div>
    );
}


export default Header;