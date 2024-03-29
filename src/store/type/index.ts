import type {ActionTree, GetterTree, ModuleTree, MutationTree} from 'vuex'

export interface RootState {
    version: string;
}

export interface Module<S, R> {
    namespaced?: boolean;
    state?: S | (() => S);
    getters?: GetterTree<S, R>;
    actions?: ActionTree<S, R>;
    mutations?: MutationTree<S>;
    modules?: ModuleTree<R>;
}
