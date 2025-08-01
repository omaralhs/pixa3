import '../Game.css';
export default function Sub(props){
    return <div className="Sub">
        <img src={props.url} alt={props.url} />
        <div className='SubInfo'>
        <p>{props.name}</p>
        <p>{props.score}</p>
        </div>
    </div>
}