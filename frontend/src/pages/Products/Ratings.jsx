import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  console.log("Ratings value:", value);
  console.log("Ratings text:", text);
  console.log("Ratings color:", color);

  // Ensure value is a number and between 0 and 5
  const clampedValue = Math.max(0, Math.min(5, Number(value) || 0));
  
  console.log("Clamped value:", clampedValue);

  const fullStars = Math.floor(clampedValue);
  const halfStars = clampedValue - fullStars > 0.5 ? 1 : 0;
  const emptyStars = Math.max(0, 5 - fullStars - halfStars);

  console.log("Full stars:", fullStars);
  console.log("Half stars:", halfStars);
  console.log("Empty stars:", emptyStars);

  const renderStars = () => {
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={`text-${color} ml-1`} />);
    }
    
    if (halfStars === 1) {
      stars.push(<FaStarHalfAlt key="half" className={`text-${color} ml-1`} />);
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={`text-${color} ml-1`} />);
    }
    
    return stars;
  };

  return (
    <div className="flex items-center">
      {renderStars()}
      <span className={`rating-text ml-2 text-${color}`}>
        {text && text}
      </span>
    </div>
  );
};

Ratings.defaultProps = {
  color: "black",
  value: 0,
};

export default Ratings;