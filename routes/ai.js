const express = require('express');
const router  = express.Router();
const axios   = require('axios');
const auth    = require('../middleware/auth');

router.post('/chat', auth, async (req, res) => {
  try {
    const { userPrompt, subtitle } = req.body;
    if (!userPrompt) return res.status(400).json({ error: 'userPrompt es requerido' });
    const pet = req.user.pet;
    const systemPrompt = pet
      ? `Sos un veterinario experto de PetConnect Shop Argentina. El usuario tiene una mascota llamada ${pet.name}, un ${pet.type} de ${pet.age} años${pet.weight ? `, ${pet.weight}kg` : ''}${pet.conditions ? `. Condiciones: ${pet.conditions}` : ''}. Respondé en español rioplatense, tono cálido y profesional. Máx 250 palabras.`
      : `Sos un veterinario experto de PetConnect Shop Argentina. Respondé en español rioplatense, tono cálido y profesional. Máx 250 palabras.`;
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      { model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] },
      { headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' } }
    );
    const text = response.data.content?.[0]?.text || 'Sin respuesta.';
    res.json({ text, subtitle: subtitle || 'Asesor PetConnect' });
  } catch (error) {
    console.error('Error Claude API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al consultar la IA' });
  }
});

module.exports = router;
