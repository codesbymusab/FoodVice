// @ts-nocheck
import IStorageService from '../../../application/interfaces/services/StorageService'
const {bucket} = require('./config')

class StorageServiceImpl implements IStorageService {

  async uploadFile(file, folder = "uploads") {
    

    const filename = `${folder}/${Date.now()}-${file.originalname}`;
    const blob = bucket.file(filename);

    await blob.save(file.buffer, {
      metadata: { contentType: file.mimetype }
    });

    
    const [url] = await blob.getSignedUrl({
      action: "read",
      expires: "03-09-2030" 
    });

    return url;
  }
}

export default StorageServiceImpl
