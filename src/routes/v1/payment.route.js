const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payments.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();
// AppImage Authorization: Bearer <token>
router.post('/payment-verification',
  paymentController.verificationSuccessHook);

router.post('/payment-failed',
  paymentController.verificationFailed);

router
  .route('/initiate')
  .post(auth('manageUsers'),
    validate(paymentValidation.initiatePayment),
    paymentController.initiatePayment);

router
  .route('/transaction-log')
  .post(auth('manageUsers'),
    validate(paymentValidation.addTransactionLog),
    paymentController.addTransactionLog);

router
  .route('/payOnService')
  .post(auth('manageUsers'),
    validate(paymentValidation.createPayment), paymentController.createOfflinePayment);

router
  .route('/verify')
  .post(auth('manageUsers'),
    validate(paymentValidation.verifyPayment), paymentController.verifyPayment);

// router
//   .route('/payment-verification')
//   .post(auth('manageUsers'), paymentController.verificationHook);

router
  .route('/refund/:paymentId')
  .post(auth('manageUsers'), validate(paymentValidation.refundPayment), paymentController.refundPayment);

router
  .route('/:paymentId')
  // .get(auth('getUsers'), validate(userValidation.getUserById), userController.getUserById)
  .patch(auth('manageUsers'), validate(paymentValidation.updatePayment), paymentController.updatePayment);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: AppImages
 *   description: User AppImage management and retrieval
 */

/**
 * @swagger
 * /appImages:
 *   post:
 *     summary: Create a AppImage
 *     description: Only admins can create other AppImages.
 *     tags: [AppImages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - appImage
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               AppImage:
 *                  type: string
 *                  enum: [AppImage, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *               AppImage: AppImage
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all AppImages
 *     description: Only admins can retrieve all AppImages.
 *     tags: [AppImages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *       - in: query
 *         name: AppImage
 *         schema:
 *           type: string
 *         description: User AppImage
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of AppImages
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /AppImages/{id}:
 *   get:
 *     summary: Get a AppImage
 *     description: Logged in AppImages can fetch only their own AppImage information. Only admins can fetch other AppImages.
 *     tags: [AppImages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a AppImage
 *     description: Logged in AppImages can only update their own information. Only admins can update other AppImages.
 *     tags: [AppImages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a AppImage
 *     description: Logged in AppImages can delete only themselves. Only admins can delete other AppImages.
 *     tags: [AppImages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
