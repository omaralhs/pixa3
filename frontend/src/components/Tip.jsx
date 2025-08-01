export default function Tip(props){
    return(
        <div className="Tip">
            <div>
                <h2>{props.title}</h2>
                <p>{props.tip}</p>
            </div>
            <img src="/images/threestar.svg" alt="" />
            
        </div>
    )
}