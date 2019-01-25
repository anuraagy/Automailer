require 'csv'    

module CampaignsHelper
  def parse_data(data)
    return [] if data.blank?

    CSV.parse(data, headers: true)
  end

  def parse_headers(data)
    return [] if data.blank?

    parse_data(data).headers
  end

  def parameterized_headers(data)
    return [] if data.blank?

    parse_headers(data).map { |header| header.present? && header.parameterize.underscore}
  end

  def csv_data_label(data)
    data.blank? ? "Upload CSV Data" : "Reupload CSV Data"
  end
end
