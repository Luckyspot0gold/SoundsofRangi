// Integration tests for SoundofRangi
describe('SoundofRangi Integration', () => {
    beforeAll(() => {
        // Initialize the core system
        SoundofRangi.init();
    });
    
    test('Core system initializes correctly', () => {
        expect(SoundofRangi.isInitialized).toBe(true);
        expect(SoundofRangi.baseFrequency).toBe(432);
    });
    
    test('Frequency calculations work correctly', () => {
        const frequency = SoundofRangi.safeFrequencyCalculation(2.5);
        expect(frequency).toBe(432 * 1.025);
        
        // Test error handling
        const invalidResult = SoundofRangi.safeFrequencyCalculation('invalid');
        expect(invalidResult).toBe(432); // Should fallback to base
    });
    
    test('Navigation between systems works', () => {
        // Test that navigation links exist and are correct
        const navLinks = document.querySelectorAll('.navigation-panel a');
        expect(navLinks.length).toBe(3);
        
        // Test each link destination
        expect(navLinks[0].href).toContain('enhanced-sonic-system.html');
        expect(navLinks[1].href).toContain('market-mayhem-orchestration.html');
        expect(navLinks[2].href).toContain('elite-api-purchase.html');
    });
});
