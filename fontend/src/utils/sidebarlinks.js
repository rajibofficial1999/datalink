import { routes } from "../routes/index.js";

export default [
  {
    'Dashboard': [
      {
        name: 'Dashboard',
        path: routes.home,
        icon: 'SquaresPlusIcon'
      },
      {
        name: 'Overview',
        path: routes.overview,
        icon: 'QueueListIcon',
        needSubscription: true
      }
    ]
  },
  {
    name: 'Information',
    path: routes.accountInformation,
    icon: 'ClipboardDocumentListIcon',
    needSubscription: true
  },
  {
    'Users' : [
      {
        name: 'Lists',
        path: routes.users,
        icon: "UsersIcon",
        normalUserCanNotAccess: true,
        needSubscription: true
      },
      {
        name: 'Create',
        path: routes.createUser,
        icon: "PlusCircleIcon",
        normalUserCanNotAccess: true,
        needSubscription: true
      }
    ]
  },
  {
    'Pending Requests' : [
      {
        name: 'Users',
        path: routes.pendingUsers,
        icon: "UsersIcon",
        normalUserCanNotAccess: true,
        needSubscription: true
      },
      {
        name: 'Domains',
        path: routes.pendingDomains,
        icon: "GlobeAltIcon",
        normalUserCanNotAccess: true,
        needSubscription: true
      },
      {
        name: 'Orders',
        path: routes.pendingOrders,
        icon: "ListBulletIcon",
      }
    ]
  },
  {
    'Domains' : [
      {
        name: 'Lists',
        path: routes.domains,
        icon: "GlobeAltIcon",
        normalUserCanNotAccess: true,
        needSubscription: true
      },
      {
        name: 'Add Domain',
        path: routes.createDomain,
        icon: "PlusCircleIcon",
        normalUserCanNotAccess: true,
        needSubscription: true
      }
    ]
  },
  {
    name: 'Orders',
    path: routes.orders,
    icon: 'ListBulletIcon'
  },
  {
    name: 'Shortener',
    path: '/shortener',
    icon: 'ShieldExclamationIcon',
    needSubscription: true
  },
  {
    name: 'Website Urls',
    path: routes.websiteUrls,
    icon: 'PaperClipIcon',
    needSubscription: true
  },
  {
    name: 'Notices',
    path: routes.notices,
    icon: 'BellAlertIcon'
  },
  {
    name: 'Supports',
    path: routes.supports,
    icon: 'MegaphoneIcon',
  },
  {
    name: 'Pricing',
    path: routes.packages,
    icon: 'CreditCardIcon',
  }
]
