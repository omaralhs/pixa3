export default function UserCard(params){
    return (
        <div className="userCard">
            <img src={params.image} alt="user avatar" />
            <h1>{params.name}</h1>
        </div>
    );
}