const express = require('express');
const router = express.Router();
const { Post, Challenge, Reward, User, CharacterReward, Character } = require('../models');
const auth = require('../middleware/auth');

// Obtener todas las recompensas desbloqueadas por un usuario
router.get('/unlocked', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Obtener todos los posts aprobados del usuario
    const approvedPosts = await Post.findAll({
      where: {
        user_id: userId,
        status: 'approved'
      },
      include: [{
        model: Challenge,
        include: [{
          model: Reward
        }]
      }]
    });

    // Obtener las recompensas de los desafíos completados
    const unlockedRewards = approvedPosts.map(post => ({
      id: post.Challenge.Reward.id,
      name: post.Challenge.Reward.name,
      image: post.Challenge.Reward.image,
      challengeTitle: post.Challenge.title
    }));

    res.json(unlockedRewards);
  } catch (error) {
    console.error('Error al obtener recompensas:', error);
    res.status(500).json({ message: 'Error al obtener recompensas' });
  }
});

// Equipar una recompensa al personaje
router.get('/equipped', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    const character = await Character.findOne({
      where: { user_id: userId },
      include: [{
        model: Reward,
        through: CharacterReward
      }]
    });

    if (!character) {
      return res.json([]);
    }

    res.json(character.Rewards || []);
  } catch (error) {
    console.error('Error al obtener recompensas equipadas:', error);
    res.status(500).json({ message: 'Error al obtener recompensas equipadas' });
  }
});

// Equipar una recompensa
router.post('/equip', auth, async (req, res) => {
  console.log('✅ Entrando a la ruta /equip');
  console.log('Body recibido:', req.body);
  console.log('UserId:', req.userId);
  
  try {
    const { rewardId } = req.body;
    const userId = req.userId;

    // Primero obtenemos el usuario
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Buscar o crear el personaje
    let character = await Character.findOne({
      where: { user_id: userId }
    });

    if (!character) {
      character = await Character.create({
        user_id: userId,
        name: user.username
      });
      console.log('✅ Personaje creado para:', user.username);
    }

    // Verificar si la recompensa ya está equipada
    const alreadyEquipped = await CharacterReward.findOne({
      where: {
        character_id: character.id,
        reward_id: rewardId
      }
    });

    if (alreadyEquipped) {
      // Si ya está equipada, la desequipamos
      await alreadyEquipped.destroy();
      return res.json({ message: 'Recompensa desequipada exitosamente' });
    }

    // Verificar si la recompensa está desbloqueada
    const hasUnlocked = await Post.findOne({
      where: {
        user_id: userId,
        status: 'approved'
      },
      include: [{
        model: Challenge,
        include: [{
          model: Reward,
          where: {
            id: rewardId
          }
        }]
      }]
    });

    if (!hasUnlocked) {
      return res.status(403).json({ message: 'Recompensa no desbloqueada' });
    }

    // Equipar la recompensa
    await CharacterReward.create({
      character_id: character.id,
      reward_id: rewardId
    });

    res.json({ 
      message: 'Recompensa equipada exitosamente',
      character: {
        id: character.id,
        name: character.name
      }
    });
  } catch (error) {
    console.error('Error al equipar recompensa:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'La recompensa ya está equipada' });
    } else {
      res.status(500).json({ message: 'Error al equipar recompensa' });
    }
  }
});

// Desequipar una recompensa
router.delete('/unequip/:rewardId', auth, async (req, res) => {
  try {
    const { rewardId } = req.params;
    const userId = req.userId;

    // Encontrar el personaje del usuario
    const character = await Character.findOne({
      where: { user_id: userId }
    });

    if (!character) {
      return res.status(404).json({ message: 'Personaje no encontrado' });
    }

    // Eliminar la relación de la recompensa
    await CharacterReward.destroy({
      where: {
        character_id: character.id,
        reward_id: rewardId
      }
    });

    res.json({ message: 'Recompensa desequipada exitosamente' });
  } catch (error) {
    console.error('Error al desequipar recompensa:', error);
    res.status(500).json({ message: 'Error al desequipar recompensa' });
  }
});

module.exports = router;