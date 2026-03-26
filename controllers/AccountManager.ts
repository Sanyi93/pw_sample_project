export type Account = {
    username: string,
    password: string
}

interface Acquirement {
    //shall return the promised "account"
    acquireAccount(id: number): Promise<Account>;
}

export class AccountManager implements Acquirement{
    
    //list of accounts
    accounts: Account[] = [
        { username: process.env.USERNAME_N!, password: process.env.PWD_N!},
        { username: process.env.USERNAME_A!, password: process.env.PWD_A!},
        { username: 'problem_user', password: 'secret_sauce'}
    ];

    //method to acquire certain account
    async acquireAccount(id: number): Promise<Account>{
        if(typeof id === 'undefined'){
            throw new Error('Id undefined');
        }
        const currentAccount = this.accounts[id%this.accounts.length];
        return Promise.resolve(currentAccount);
    }
}