import {create} from 'zustand';

interface NavigationState {
    canAccessPage2 : boolean ,
    allowPage2Access : () => void,
    resetAccess : ()=> void
}

export const useNavigationStore = create<NavigationState>((set)=>({
    canAccessPage2 : false,
    allowPage2Access : ()=>(set({canAccessPage2 : true})),
    resetAccess : ()=>(set({canAccessPage2 : false}))
}))