import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  // Ensure value is a number and between 0 and 5
  const clampedValue = Math.max(0, Math.min(5, Number(value) || 0));

  const fullStars = Math.floor(clampedValue);
  const halfStars = clampedValue - fullStars > 0.5 ? 1 : 0;
  const emptyStars = Math.max(0, 5 - fullStars - halfStars);

  const renderStars = () => {
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} style={{ color }} />);
    }
    
    if (halfStars === 1) {
      stars.push(<FaStarHalfAlt key="half" style={{ color }} />);
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color }} />);
    }
    
    return stars;
  };

  return (
    <div className="flex items-center">
      {renderStars()}
      <span className="rating-text ml-2 text-white">
        {text && text}
      </span>
    </div>
  );
};

Ratings.defaultProps = {
  color: "#ffd700", 
};

export default Ratings;