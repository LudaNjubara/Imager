const capitalizeFirstLetter = (str: string | undefined) => {
    if (!str) return;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export { capitalizeFirstLetter };