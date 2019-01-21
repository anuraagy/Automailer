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

    parse_headers(data).map { |header| header.parameterize.underscore}
  end
end
