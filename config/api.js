export const MethodHeaders = {



    LOGIN:{
        URL:"/api/login",
        options:{

        },
        method:"post"
    
    },

    SIGNUP:{
        URL:"/api/signup",
        options:{

        },
        method:"post"
    
    },
    GET_EVENTS:{
        URL:"/api/events?name={{NAME}}&page={{PAGE}}",
        options:{

        },
        method:"get"
    
    },
    GET_EVENT_BY_ID:{
        URL:"/api/events/{{ID}}",
        options:{

        },
        method:"get"
    
    },
    REGISTER_FOR_EVENT:{
        URL:"/api/events/registration",
        options:{

        },
        method:"post"
    
    },
    DAILY_STATS:{
        URL:"api/admin/daily",
        options:{

        },
        method:"get"
    
    },
    POPULAR_EVENT:{
        URL:"api/admin/popular",
        options:{

        },
        method:"get"
    
    },




}