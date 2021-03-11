import React from 'react';

interface IProps {
  orientation: 'vertical' | 'horizontal';
  total: number;
  width: number;
  height: number;
}

const Divisions: React.FC<IProps> = ({ orientation, total, width, height }) => {
  let divs = new Array(total).fill(null);

  if (orientation === 'vertical') {
    divs = divs.map((v, i) => {
      const position = (i / total) * width;
      return (
        <line
          key={i}
          x1={position}
          y1="0"
          x2={position}
          y2={height}
          stroke={i === total / 2 ? 'grey' : 'lightgrey'}
        />
      );
    });
  }

  if (orientation === 'horizontal') {
    divs = divs.fill(null).map((v, i) => {
      const position = (i / total) * height;
      return (
        <line
          key={i}
          x1="0"
          y1={position}
          x2={width}
          y2={position}
          stroke={i === total / 2 ? 'grey' : 'lightgrey'}
        />
      );
    });
  }

  return <>{divs}</>;
};

export default Divisions;
