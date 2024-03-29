﻿using MRF.Models.Models;

namespace MRF.DataAccess.Repository.IRepository
{
    public interface IEmailRecipientRepository : IRepository<EmailRecipient>
    {
        public List<EmailRecipient> GetEmailRecipient(int? MrfStatusId = null, string? MrfStatus = null);
        public List<EmailRecipient> GetEmailRecipient(int? MrfStatusId = null, string? MrfStatus = null, int? MrfId=null);
        public List<EmailRecipient> GetEmployeeEmail(string empRole);
        public List<EmailRecipient> GetEmployeeEmailByRoleIds(List<int> roleId);
        public string getEmail(int id);
        public List<EmailRecipient> GetEmployeeEmailByRoleIds(List<int> roleId, int mrfId);
        public List<string> GetRoleEmails(string roleId);
    }
}
