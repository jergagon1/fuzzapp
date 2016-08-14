class ReportsController < ApplicationController
  before_filter :authenticate_user!

  respond_to :js

  def status
    render json: { value: 'jeremy', user_count: User.all.count }
  end

  def create
    @report = Report.new report_params
    @report.user = current_user
    @user = User.where(id: params[:report][:user_id]).first || User.first
    # TODO: fix when added authorization
    if @report.save
      render json: { report: @report, wags: @user.reload.wags, tags: @report.tag_list }
    else
      render json: { errors: @report.errors.full_messages }
    end
  end

  def show
    @report = Report.find params[:id]
    @tags = @report.tags
    @comments = @report.comments
    render json: { :report => @report, :tags => @tags, :comments => @comments, :user => @report.user }
  end

  def update
    # TODO: prevent updating reports that not belong to user
    @report = Report.find params[:id]
    @report.update_attributes report_params
    render json: @report
  end

  def destroy
    # TODO: prevent removing reports that not belong to user
    @report = Report.find params[:report_id]
    render json: @report.destroy
  end

  def mapquery
    swa = params[:sw].split(',').map(&:to_f)
    nea = params[:ne].split(',').map(&:to_f)
    # Make the SW as a point instance in Geokit
    sw = Geokit::LatLng.new(swa.first, swa.last)
    # Make the NE as a point instance in Geokit
    ne = Geokit::LatLng.new(nea.first, nea.last)

    # Filter reports per Filterable module
    # Use Geokit in_bounds method to get report instances within map extents
    @reports = Report.filter(
      params.slice(:report_type, :animal_type, :sex, :pet_size, :age, :breed, :color)
    ).in_bounds([sw, ne])

    if params[:filter_tags].present?
      # Filter by tags in parameters
      @reports.tagged_with(params[:filter_tags], any: true)
    end

    render json: @reports.reverse_order
  end

  private
  def report_params
    params.require(:report).permit(
      :pet_name, :animal_type, :lat, :lng,
      :user_id, :report_type, :notes,
      :img_url, :age, :breed, :sex,
      :pet_size, :distance, :color,
      :last_seen, :tag_list,
      :address
    )
  end
end
