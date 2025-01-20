
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3001;

// Servir arquivos estáticos (HTML, CSS, JS, etc)
app.use(express.static('public'));

// Definir um endpoint para retornar dados de categorias (usando o JSON)
app.get('/categorias', async (req, res) => {
    try {
        const data = await fs.promises.readFile(path.join(__dirname, 'categorias.json'), 'utf-8');
        const categorias = JSON.parse(data);
        res.json(categorias);
    } catch (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        res.status(500).send('Erro no servidor');
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
