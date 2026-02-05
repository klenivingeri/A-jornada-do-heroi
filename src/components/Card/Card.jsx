export const Card = ({ title="title", content="content" }) => {

  return(<div className="card">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  )
}