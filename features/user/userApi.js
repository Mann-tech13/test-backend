// internal dependencies
const Joi = require('joi');
const ApiSchema = require('../../base/apiSchema.js');
const UserController = require('./userController.js');

const roles = require('../../middleware/roles');
// const { twoFactorCodeGen, attachLocalUser } = require('../../middleware/two-factor-auth.js');
/**
 * Get current user details
 */
const GetCurrentUser = {
  path: '/get-current-user',
  verb: 'GET',
  handler: {
    controller: UserController,
    method: 'getCurrentUser'
  },
  middleware: {
    loginSecuredRoute: [roles.admin, roles.user]
  }
};

/**
 * Handles user signup
 */
const UserSignUp = {
  path: '/create-user',
  verb: 'POST',
  handler: {
    controller: UserController,
    method: 'createUser',
    arguments: ['request:body']
  },
  request: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      role: Joi.string().required(),
      companyName: Joi.string().required()
    }
  }
};

/**
 * Handles add new user
 */
const AddNewUser = {
  path: '/add-new-user',
  verb: 'POST',
  handler: {
    controller: UserController,
    method: 'addNewUser',
    arguments: ['request:body']
  },
  middleware: {
    loginSecuredRoute: [roles.admin]
  },
  request: {
    body: {
      email: Joi.string().email().required(),
      companyName: Joi.string().required(),
      role: Joi.string().required(),
      firstName: Joi.string().allow(null, '').optional(),
      lastName: Joi.string().allow(null, '').optional(),
      country: Joi.string().allow(null, '').optional(),
      contactNumber: Joi.string().allow(null, '').optional(),
      jobTitle: Joi.string().allow(null, '').optional()
    }
  }
};

/**
 * Handles user status change
 */
const ChangeVerificationStatus = {
  path: '/change-verification-status',
  verb: 'POST',
  handler: {
    controller: UserController,
    method: 'changeVerificationStatus',
    arguments: ['request:body']
  },
  middleware: {
    loginSecuredRoute: [roles.admin]
  },
  request: {
    body: {
      id: Joi.string().required(),
      status: Joi.string().required()
    }
  }
};

/**
 * Handles user deletion
 */
const deleteUser = {
  path: '/delete-user',
  verb: 'DELETE',
  handler: {
    controller: UserController,
    method: 'deleteUser',
    arguments: ['request:body']
  },
  middleware: {
    loginSecuredRoute: [roles.admin]
  },
  request: {
    body: {
      id: Joi.string().required()
    }
  }
};

/**
 * Handles forgot password request from user and admin screens
 */
const ForgotPassword = {
  path: '/forgot-password',
  verb: 'POST',
  handler: {
    controller: UserController,
    method: 'forgotPassword',
    arguments: ['request:body']
  },
  request: {
    body: {
      email: Joi.string().email().required(),
      role: Joi.string().required()
    }
  }
};

/**
 * Handles change password request from user and admin screens
 */
const ChangePassword = {
  path: '/change-password',
  verb: 'POST',
  handler: {
    controller: UserController,
    method: 'changePassword',
    arguments: ['request:body']
  },
  middleware: {
    loginSecuredRoute: [roles.admin, roles.user]
  },
  request: {
    body: {
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required()
    }
  }
};

/**
 * Handles reset password request from forgot password request
 */
const ResetPassword = {
  path: '/reset-password',
  verb: 'POST',
  handler: {
    controller: UserController,
    method: 'resetPassword',
    arguments: ['request:body']
  },
  request: {
    body: {
      token: Joi.string().required(),
      newPassword: Joi.string().required()
    }
  }
};

/**
 * Handles user update
 */
const updateUser = {
  path: '/update-user',
  verb: 'PUT',
  handler: {
    controller: UserController,
    method: 'updateUser',
    arguments: ['request:body']
  },
  middleware: {
    loginSecuredRoute: [roles.admin, roles.user]
  },
  request: {
    body: {
      contactNumber: Joi.string().optional().allow(null, ''),
      country: Joi.string().optional().allow(null, ''),
      firstName: Joi.string().optional().allow(null, ''),
      lastName: Joi.string().optional().allow(null, ''),
      jobTitle: Joi.string().optional().allow(null, '')
    }
  }
};

/**
 * Get all users
 */
const getAllUsers = {
  path: '/get-users',
  verb: 'POST',
  handler: {
    controller: UserController,
    method: 'getAllUsers',
    arguments: ['request:body']
  },
  middleware: {
    loginSecuredRoute: [roles.admin]
  },
  request: {
    body: {
      searchTerm: Joi.string().allow(''),
      verificationStatus: Joi.string().required(),
      orderColumn: Joi.string().optional().allow(''),
      orderByAsc: Joi.boolean().optional(),
      page: Joi.number().required(),
      pageSize: Joi.number().required()
    }
  }
};

const verifyAccount = {
  path: '/verify-account',
  verb: 'PUT',
  handler: {
    controller: UserController,
    method: 'verifyAccount',
    arguments: ['request:body']
  },
  request: {
    body: {
      token: Joi.string().required()
    }
  }
};

const resendCode = {
  path: '/resend-two-factor-code',
  verb: 'GET',
  handler: {
    controller: UserController,
    method: 'sendTwoFactorCodeResponse'
  },
  middleware: {
    attachLocalUser,
    twoFactorCodeGen
  }
};

/**
 * Get Notification
 */
const GetNotifications = {
  path: '/notification',
  verb: 'GET',
  handler: {
    controller: UserController,
    method: 'getNotifications'
  },
  middleware: {
    loginSecuredRoute: [roles.user, roles.admin]
  }
};

/**
 * Delete Notification
 */
const DeleteNotification = {
  path: '/notification',
  verb: 'DELETE',
  handler: {
    controller: UserController,
    method: 'deleteNotification',
    arguments: ['request:body']
  },
  request: {
    body: {
      fetchedOn: Joi.date().required()
    }
  },
  middleware: {
    loginSecuredRoute: [roles.user, roles.admin]
  }
};

const user = {
  name: 'User',
  url: '/api/user',
  endpoints: [UserSignUp, AddNewUser, GetCurrentUser, ChangeVerificationStatus, deleteUser, updateUser, getAllUsers, ForgotPassword, ChangePassword, verifyAccount, resendCode, ResetPassword, GetNotifications, DeleteNotification]
};

module.exports = new ApiSchema(user);
