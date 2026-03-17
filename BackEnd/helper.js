// function to reuse
// isValidId verify the valoux Id if it valide

function isValidId(value){
    return Number.isInteger(Number(value)) && Number (value) > 0;
}


// exporte for reuse ervery file
export {isValidId};