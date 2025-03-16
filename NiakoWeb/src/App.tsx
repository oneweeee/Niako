import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Component } from 'react';

import { NotFound } from './pages/notfound/NotFound';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Database } from './pages/database/Database';
import { Commands } from './pages/commands/Commands';
import { Callback } from './pages/callback/Callback';
import { Logout } from './pages/logout/Logout';
import { Login } from './pages/login/Login';

import { TTheme } from './types/theme';
import { apiUrl } from './config';
import './assets/scss/App.scss';

export default class App extends Component {
    state: { theme: TTheme } = {
        theme: JSON.parse(localStorage.getItem('niako') ?? '{ "darkTheme": "123" }')?.darkTheme ? 'dark' : 'light'
    }

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' />
                    <Route path='/login' element={ <Login /> } />
                    <Route path='/logout' element={ <Logout /> } />
                    <Route path='/callback' element={ <Callback /> } />
                    <Route path='/commands' element={ <Commands /> } />
                    <Route path='/database' element={ <Database /> } />
                    <Route path='/dashboard' element={ <Dashboard theme={this.state.theme} /> } />
                    <Route path='*' element={ <NotFound /> } />
                </Routes>
            </BrowserRouter>
        )
    }

    async componentDidMount() {
        document.documentElement.dataset.theme = this.state.theme
        
        await this.buildConfig()

        if(
            !JSON.parse(localStorage.getItem('niako') ?? '{}')?.currentUser &&
            window.location.pathname !== '/login' &&
            window.location.pathname !== '/callback' &&
            window.location.pathname !== '/test'
        ) {
            window.location.href = '/login'
        } else {
            if(window.location.pathname === '/') {
                setTimeout(() => {
                    window.location.href = '/dashboard'
                }, 1000)
            }
        }

        /*console.log(`
                                                                                                                                                                                             
                                          .~!!~.                                                                                                                                                
                                         ?&@@@@&Y                               !?????!                                                                                                         
        7555557             ~555555^    .&@@@@@@@:                              B@@@@@G                                                                                                         
        5@@@@@@G~           ?@@@@@@!     ~G&&&&G!                               G@@@@@G                                                                                                         
        5@@@@@@@@5:         ?@@@@@@!        ...                                 G@@@@@G                                                                                                         
        5@@@@@@@@@&J.       ?@@@@@@!     :??????:       .^!?JY555YJ7~:          G@@@@@G        ^?????JJ~       .^!?YY55YJ7~:                                                                    
        5@@@@@@@@@@@#7      ?@@@@@@!     ~@@@@@@!    .YB&@@@@@@@@@@@@&B?.       G@@@@@G      ~5&@@@@@B7.    .7P#@@@@@@@@@@@&GJ:                                                                 
        5@@@@@@&@@@@@@G~    ?@@@@@@!     ~@@@@@@!     ?@@@@&#BBB#&@@@@@@#^      G@@@@@G    !G@@@@@@P~      ?#@@@@@@&###&@@@@@@@5.                                                               
        5@@@@@&~Y@@@@@@@5:  ?@@@@@@!     ~@@@@@@!      !57^.     :7#@@@@@#.     G@@@@@G .?B@@@@@@P~       5@@@@@@P!:. ..~Y&@@@@@B:                                                              
        5@@@@@@: ^P@@@@@@&J 7@@@@@@!     ~@@@@@@!          .::::::.?@@@@@@~     G@@@@@BY&@@@@@@5^        ?@@@@@@?         ~&@@@@@P                                                              
        5@@@@@@:   ~B@@@@@@BP@@@@@@!     ~@@@@@@!     .75G#&@@@@@@@@@@@@@@!     G@@@@@@@@@@@@@@J.        G@@@@@#           5@@@@@&.                                                             
        5@@@@@@:     7#@@@@@@@@@@@@!     ~@@@@@@!    !#@@@@@#GPPPPPG@@@@@@!     G@@@@@@@@@@@@@@@#7       5@@@@@&:          G@@@@@#.                                                             
        5@@@@@@:      .J&@@@@@@@@@@!     ~@@@@@@!   .&@@@@@J       ~@@@@@@!     G@@@@@@&5^!B@@@@@@G^     ~@@@@@@G:       .Y@@@@@@?                                                              
        5@@@@@@:        ^P@@@@@@@@@!     ~@@@@@@!   .&@@@@@5:   .:?#@@@@@@!     G@@@@@B:    ?&@@@@@@Y.    !&@@@@@&P?!!!?5#@@@@@@J                                                               
        5@@@@@@:          ~G@@@@@@@!     ~@@@@@@!    !&@@@@@@#BB#@@@@@@@@@!     G@@@@@G      :5@@@@@@#7    :Y#@@@@@@@@@@@@@@@&P~                                                                
        Y@&&&&&:            7#&&&&@!     ~@&&&&@!     :?G#&@@@@@&BY^G@&&&@!     G@&&&@P        ^G&&&&@@P^    .!YG#&@@@@@@&B57:                                                                  
        .::::::              .:::::.      ::::::.        .:^~~^^:   .:::::.     .:::::.          ::::::::        .:^~~~^:.                                                                      
                                                                                                           

`)*/
    }

    async buildConfig() {
        if(localStorage.getItem('react')) {
            localStorage.removeItem('react')
        }

        const item = localStorage.getItem('niako')
        if(!item) {
            localStorage.setItem(
                'niako',
                JSON.stringify(
                    {
                        cookieAccepted: false,
                        darkTheme: true,
                        locale: 'ru',
                        currentUser: null
                    }
                )
            )
        } else {
            const json = JSON.parse(item)
            if(!json?.currentUser?.token) return

            const response = await fetch(`${apiUrl}/private/user/token`, {
                headers: {
                    'Authorization': json.currentUser.token
                }
            }).then(async (res) => await res.json()).catch(() => ({ status: true }))
            
            if(!response?.status) {
                json.currentUser = null
                localStorage.setItem('niako', JSON.stringify(json))
            } else if(response?.answer) {
                json.currentUser = response.answer
                localStorage.setItem('niako', JSON.stringify(json))
            }
        }
    }
}