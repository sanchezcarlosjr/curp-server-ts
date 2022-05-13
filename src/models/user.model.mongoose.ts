import { Schema } from "mongoose";
import { languagesSupported } from "../utils/translater";

const ipInfo = new Schema({
  ip: {
    type: String,
    required: true,
  },
  hostname: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  loc: {
    type: String,
    required: true,
  },
  org: {
    type: String,
    required: true,
  },
  postal: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
});

const deviceInfo = new Schema({
  device: {
    type: String,
    required: true,
  },
  ipInfo: {
    type: ipInfo,
    required: true,
  }
});

const systemMessage = new Schema({
  date: {
    type: Date,
    required: true,
  },
  tag: {
    type: String,
    enum: ["api-service", "basic-info", "security-info"],
    required: true,
  },
  by: {
    type: String,
    enum: ["user", "system", "support"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const user = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    address: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  security: {
    topt: {
      type: String,
      required: true,
    },
    hashPassword: {
      type: String,
      required: true,
    },
    recoverCode: {
      type: [
        {
          code: {
            type: String,
            required: true,
          },
          used: {
            type: Boolean,
            default: false,
            required: true,
          }
        },
        {
          _id: false
        }
      ],
      required: true,
    },
    accountActivity: {
      success: {
        type: [
          {
            ...deviceInfo.obj,
            jwt: {
              secret: {
                type: String,
                required: true,
              },
              current: {
                type: String,
                required: true,
              }
            },
            expiresAt: {
              type: Number,
              required: true,
            }
          },
        ],
      },
      reject: {
        type: [deviceInfo],
      },
      ipBlackList: {
        type: [String],
      },
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  apiKeys: {
    type: [
      {
        key: {
          type: String,
          required: true,
        },
        quota: {
          perMonth: {
            type: Number,
            required: true,
          },
          perMinute: {
            type: Number,
            required: true,
          }
        },
        packageId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        billing: {
          //! Pendiente en desarrollar este apartado
          type: [
            {
              date: {
                month: {
                  type: Number,
                  enum: [0,1,2,3,4,5,6,7,8,9,10,11],
                  required: true,
                },
                year: {
                  type: Number,
                  required: true,
                }
              },
              status: {
                type: String,
                enum: ["PENDING", "PAID"],
                required: true,
              },
              provider: {
                type: String,
                enum: ["PAYPAL", "STRIPE"],
                required: true,
              }
            }
          ]
        },
        status: {
          type: String,
          enum: ["BANNED", "INACTIVE", "ACTIVE"],
          required: true,
        },
        termsconditions: {
          value: {
            type: String,
            required: true,
          },
          sign: {
            type: String,
            required: true,
          }
        }
      }
    ]
  },
  photoURL: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: languagesSupported,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  systemMessage: {
    type: [systemMessage],
  },
});
