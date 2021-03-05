import { Router } from 'express';

const router = Router(); 

router.get('/user-info', (req, res) => {
    return res.send('user-info');
  });

export default router;
