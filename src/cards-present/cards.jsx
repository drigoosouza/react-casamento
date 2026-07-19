
export default function CardPresente({ imagem, titulo, valor, onPresentear }) {
  return (
    <div className="card-presente">
      <img src={imagem} alt={titulo} />
      <div className="card-info">
        <h3>{titulo}</h3>
        <p>{valor}</p>
        <button className="btn-presente" onClick={onPresentear}>
          Presentear
        </button>
      </div>
    </div>
  );
}