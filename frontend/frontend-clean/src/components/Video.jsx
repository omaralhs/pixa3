
export default function Video(){
    return(<div className="Video">
          <video controls>
        <source
          src="/images/pixa.mov"
          type="video/ogg"
        />
        Your browser does not support the video tag.
      </video>
    </div>)
}