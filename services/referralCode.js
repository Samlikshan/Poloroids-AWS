function generateReferralCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const characters = letters + numbers;
    
    let result = '';
    
    // Ensure at least one letter and one number
    result += letters[Math.floor(Math.random() * letters.length)];
    result += numbers[Math.floor(Math.random() * numbers.length)];
    
    // Generate the remaining 6 characters
    for (let i = 2; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    
    // Shuffle the result to randomize character positions
    result = result.split('').sort(() => Math.random() - 0.5).join('');
    
    return result;
}


module.exports = generateReferralCode