// Babel sert uniquement à Jest : il traduit le JSX et les imports ES en code que Jest comprend.
// (Vite n'utilise pas ce fichier pour l'application.)
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  // Remplace import.meta.env (spécifique à Vite) par process.env pendant les tests
  plugins: ['babel-plugin-transform-vite-meta-env'],
}
