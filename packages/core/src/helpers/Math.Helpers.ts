
  
  export function saturate( value: number ) {
    return Math.max( Math.min( value, 1 ), 0 );
  }