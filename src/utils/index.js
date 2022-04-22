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

export const convertRole = (role) => {
    if (role === "Chairman") {
        return 0
    } else if(role === "Admin") {
        return 1
    } else if(role === "Teacher") {
        return 2
    } else {
        return 3
    }
}

export const parseElection = (data) => {
    const header = data[0]

    let election = {}

    for (let i = 0; i < header.length; i++) {
        election[header[i]] = []
    }

    for (let i = 1; i < data.length; i++) {
        const j = data[i]

        for (let k = 0; k < j.length; k++) {
            let l = election[header[k]]
            if (header[k] === "RoleLimit") {
                l.push(convertRole(j[k]))
            } else {
                l.push(j[k])
            }
            election[header[k]] = l
        }
    }

    return election
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