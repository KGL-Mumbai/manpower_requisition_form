﻿using MRF.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MRF.DataAccess.Repository.IRepository
{
    public interface  IMrfLastNumberRepository: IRepository<MrfLastNumber>
    {
        public void Update(MrfLastNumber MrfLastNumber);
    }
}
