export default interface IStorageService {
  uploadFile(file:any, folder :string):Promise<unknown>
}


