const CreatorCredit = () => {
  const handleClick = () => {
    window.open('https://www.sekaraa.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="creator-credit"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="creator-info">
        <p>
          Created by <span className="creator-name">Chan RG</span>
        </p>
      </div>
    </div>
  );
};

export default CreatorCredit;
