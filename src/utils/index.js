export const sortFiles = (files) => {
    if(files){
        return files.sort(compare)
    } else{
        return files
    }
}

export const getRole = (role) => {
    if (role === 0) {
        return "Chairman"
    } else if (role === 1) {
        return "Admin"
    } else if (role === 2) {
        return "Teacher"
    } else {
        return "Student"
    }
}

function compare(first, second) {
    try {    
        if (first.role < second.role){
            return -1;
        }
        if (first.role > second.role){
            return 1;
        }
        return 0;
    } catch(error) {
        console.log("Error: ", error)
    }
}