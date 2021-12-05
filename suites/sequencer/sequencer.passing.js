function sequencer(initialValue = 0, step = 1) { 
    let current;

     return function () { 
         if (!current) {
             return current = initialValue;
         } else {
             current += step;
             return current;
         }
     }
}