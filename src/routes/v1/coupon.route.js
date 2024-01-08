const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const couponValidation = require('../../validations/coupon.validation');
const couponController = require('../../controllers/coupon.controller');

const router = express.Router();
// Coupon Authorization: Bearer <token>
router
  .route('/')
  .post(auth('manageUsers'), validate(couponValidation.createCoupon), couponController.createCoupon)
  .get(validate(couponValidation.getAllCoupons), couponController.getAllCoupons);
  // .get(auth('getUsers'), validate(couponValidation.getAllCoupons), couponController.getAllCoupons);

router
  .route('/selectedServices')
  .post(couponController.getCoupons);
  // .route('/selectedServices').post( validate(couponValidation.getCoupons), couponController.getCoupons);
  // .post(auth('getUsers'), validate(couponValidation.getCoupons), couponController.getCoupons);

router
  .route('/apply-coupon')
  .post( validate(couponValidation.applyCoupon), couponController.applyCoupon);
  // .post(auth('getUsers'), validate(couponValidation.applyCoupon), couponController.applyCoupon);

router
  .route('/:couponId')
  .get(validate(couponValidation.getAllCoupons), couponController.getCouponById)
  // .get(auth('getUsers'), validate(couponValidation.getAllCoupons), couponController.getCouponById)
  .delete(auth('manageUsers'), validate(couponValidation.deleteCoupon), couponController.deleteCoupon);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: User Coupon management and retrieval
 */

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create a Coupon
 *     description: Only admins can create other Coupons.
 *     tags: [Coupons]
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
 *               - coupon
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
 *               coupon:
 *                  type: string
 *                  enum: [Coupon, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *               coupon: Coupon
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
 *     summary: Get all Coupons
 *     description: Only admins can retrieve all Coupons.
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *       - in: query
 *         name: coupon
 *         schema:
 *           type: string
 *         description: User coupon
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
 *         description: Maximum number of Coupons
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
 * /coupons/{id}:
 *   get:
 *     summary: Get a Coupon
 *     description: Logged in Coupons can fetch only their own Coupon information. Only admins can fetch other Coupons.
 *     tags: [Coupons]
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
 *     summary: Update a Coupon
 *     description: Logged in Coupons can only update their own information. Only admins can update other Coupons.
 *     tags: [Coupons]
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
 *     summary: Delete a Coupon
 *     description: Logged in Coupons can delete only themselves. Only admins can delete other Coupons.
 *     tags: [Coupons]
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
