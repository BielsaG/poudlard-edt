module.exports = {
  // Simule un navigateur (document, window...) pour tester les composants React
  testEnvironment: 'jsdom',
  // Fichier exécuté avant chaque fichier de test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Les tests sont les fichiers *.test.js / *.test.jsx dans src/
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx}'],
  // Jest ne sait pas lire les images et le CSS : on les remplace par un faux module
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/styleMock.cjs',
    '\\.(png|jpe?g|svg|gif)$': '<rootDir>/test/fileMock.cjs',
  },
}
